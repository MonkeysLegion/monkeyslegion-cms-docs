'use client';
import { AlertTriangle, ServerCrash, FileX, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface Error {
    status?: number;
    message?: string;
}

const getErrorConfig = (errorCode: number) => {
    switch (errorCode) {
        case 400:
            return {
                icon: AlertTriangle,
                title: "Demande invalide",
                message: "La demande envoyée n'est pas valide. Veuillez vérifier les informations saisies et réessayer.",
                color: "text-orange-500"
            };
        case 401:
            return {
                icon: Shield,
                title: "Non autorisé",
                message: "Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous connecter et réessayer.",
                color: "text-red-500"
            };
        case 403:
            return {
                icon: Shield,
                title: "Accès interdit",
                message: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
                color: "text-red-600"
            };
        case 404:
            return {
                icon: FileX,
                title: "Page non trouvée",
                message: "La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou revenez à l'accueil.",
                color: "text-blue-500"
            };
        case 408:
            return {
                icon: Clock,
                title: "Délai d'attente dépassé",
                message: "La demande a pris trop de temps à traiter. Veuillez vérifier votre connexion et réessayer.",
                color: "text-yellow-500"
            };
        case 422:
            return {
                icon: AlertTriangle,
                title: "Données non valides",
                message: "Les données soumises ne sont pas valides. Veuillez corriger les erreurs et réessayer.",
                color: "text-orange-600"
            };
        case 429:
            return {
                icon: Clock,
                title: "Trop de demandes",
                message: "Vous avez effectué trop de demandes. Veuillez patienter quelques instants avant de réessayer.",
                color: "text-purple-500"
            };
        case 500:
            return {
                icon: ServerCrash,
                title: "Erreur serveur interne",
                message: "Une erreur s'est produite sur nos serveurs. Nos équipes ont été notifiées et travaillent à résoudre le problème.",
                color: "text-red-500"
            };
        case 502:
            return {
                icon: ServerCrash,
                title: "Passerelle défaillante",
                message: "Le serveur a reçu une réponse invalide. Veuillez réessayer dans quelques instants.",
                color: "text-red-600"
            };
        case 503:
            return {
                icon: ServerCrash,
                title: "Service indisponible",
                message: "Le service est temporairement indisponible pour maintenance. Veuillez réessayer plus tard.",
                color: "text-orange-500"
            };
        case 504:
            return {
                icon: Clock,
                title: "Délai d'attente de la passerelle",
                message: "Le serveur n'a pas reçu de réponse à temps. Veuillez réessayer dans quelques instants.",
                color: "text-yellow-600"
            };
        default:
            return {
                icon: AlertTriangle,
                title: "Une erreur est survenue",
                message: "Une erreur inattendue s'est produite. Veuillez essayer de rafraîchir la page ou contacter le support si le problème persiste.",
                color: "text-destructive"
            };
    }
};

export default function UnexpectedError({ error }: { error?: Error }) {
    const errorCode = error?.status;
    const config = getErrorConfig(errorCode || 0);
    const IconComponent = config.icon;

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-card text-card-foreground rounded-xl border py-6 shadow-sm @container/card">
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                <div className="p-6 rounded-full mb-6">
                    <IconComponent size={64} className={config.color} />
                </div>

                <h2 className="text-2xl font-semibold mb-3">{config.title}</h2>

                <p className="mb-6 text-muted-foreground">
                    {config.message}
                    {errorCode && (
                        <span className="block mt-2 text-sm">
                            Code d&apos;erreur : {errorCode}
                        </span>
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleRefresh} variant="outline">
                        Actualiser
                    </Button>
                </div>
            </div>
        </div>
    );
}
