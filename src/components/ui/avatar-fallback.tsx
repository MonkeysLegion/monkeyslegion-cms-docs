import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const CustomAvatarFallback = ({ name, className = "h-8 w-8" }: { name: string; className?: string }) => {
    const getInitials = (name: string) => {
        if (!name) return 'UN';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <Avatar className={className}>
            <AvatarFallback className="bg-blue-500 text-white font-semibold">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    );
};

export default CustomAvatarFallback;
