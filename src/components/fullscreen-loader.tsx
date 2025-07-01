import { LoaderIcon } from "lucide-react";

interface FullScreenLoaderProps {
    label?: string;
}

export const FullScreenLoader = ({ label }: FullScreenLoaderProps) => {
    return (
        <div className="flex flex-col min-h-screen gap-2 items-center justify-center">
            <LoaderIcon className="animate-spin size-6 text-muted-foreground" />
            {label && <p className="text-sm text-muted-foreground">{label}</p>}
        </div>
    );
}