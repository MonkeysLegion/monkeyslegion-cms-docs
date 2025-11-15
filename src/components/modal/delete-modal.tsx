"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

/**
 * General Delete Confirmation Modal
 * 
 * Usage Examples:
 * 
 * 1. Basic usage with API call:
 * <DeleteModal 
 *   id="123"
 *   itemName="User"
 *   onDelete={handleDelete}
 * />
 * 
 * 2. With custom display reference:
 * <DeleteModal
 *   id="456"
 *   itemName="Project"
 *   reference="Project Alpha"
 *   onDelete={handleDelete}
 *   view={2}
 * />
 * 
 * 3. With table refresh:
 * <DeleteModal
 *   id="789"
 *   itemName="Task"
 *   onDelete={handleDelete}
 *   onSuccess={() => tableRef.current?.refresh()}
 * />
 */

interface DeleteModalProps {
    id?: string | number | null;
    itemName?: string;
    reference?: string;
    view?: 1 | 2; // 1 = icon button, 2 = text button
    onDelete?: (id: string | number) => Promise<void>;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    // Fallback props for when no handlers are provided
    showToast?: (message: string, type: 'success' | 'error') => void;
}

const DeleteModal = ({
    id = null,
    itemName = 'Item',
    reference = '',
    view = 1,
    onDelete,
    onSuccess,
    onError,
    isLoading: externalLoading = false,
    disabled = false,
    className = "",
    showToast = (message: string, type: 'success' | 'error') => {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}: DeleteModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleConfirmDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        if (id == null) {
            showToast('No item selected for deletion', 'error');
            return;
        }

        if (!onDelete) {
            showToast('Delete handler not provided', 'error');
            return;
        }

        setIsDeleting(true);

        try {
            await onDelete(id);
            showToast(`${itemName} deleted successfully`, 'success');
            setOpen(false);
            onSuccess?.();
        } catch (error: unknown) {
            const getMessageFromUnknown = (err: unknown): string => {
                if (typeof err === 'string') return err;
                if (err instanceof Error) return err.message;
                if (typeof err === 'object' && err !== null) {
                    const maybe = err as { response?: { data?: { message?: unknown } } };
                    const msg = maybe.response?.data?.message;
                    if (typeof msg === 'string') return msg;
                }
                return 'Failed to delete item';
            };

            const errorMessage = getMessageFromUnknown(error);
            showToast(errorMessage, 'error');
            onError?.(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const isButtonDisabled = disabled || externalLoading || isDeleting;

    return (
        <>
            {view === 1 ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="destructive"
                                className={`h-8 w-8 bg-red-100 p-1.5 text-red-600 hover:bg-red-200 ${className}`}
                                onClick={() => setOpen(true)}
                                disabled={isButtonDisabled}
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            arrowClassName="bg-red-100 fill-red-100"
                            className="tooltip-content rounded-md bg-red-100 px-2 py-1 text-red-600 shadow-md"
                            sideOffset={5}
                        >
                            Delete {itemName}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <Button
                    variant="outline"
                    className={`gap-2 ${className}`}
                    onClick={() => setOpen(true)}
                    disabled={isButtonDisabled}
                >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Delete
                </Button>
            )}

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg font-semibold">
                                    Delete {itemName}
                                </AlertDialogTitle>
                            </div>
                        </div>
                    </AlertDialogHeader>

                    <AlertDialogDescription className="text-sm text-muted-foreground mt-4">
                        Are you sure you want to delete this {itemName.toLowerCase()} with identifier{" "}
                        <span className="font-semibold text-foreground text-truncate">
                            &quot;{reference && reference.length > 0 ? reference : id}&quot;
                        </span>
                        ? This action is irreversible and will permanently delete all {itemName.toLowerCase()} data.
                    </AlertDialogDescription>

                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <form onSubmit={handleConfirmDelete}>
                            <AlertDialogAction
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Deleting...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4 text-white" />
                                        Delete {itemName}
                                    </div>
                                )}
                            </AlertDialogAction>
                        </form>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DeleteModal