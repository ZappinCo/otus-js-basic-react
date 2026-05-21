interface LoadingButtonProps {
    isLoading?: boolean;
    onClick?: () => void;
    buttonText?: string;
    loadingText?: string;
}

export default function LoadingButton({
    isLoading = false,
    onClick,
    buttonText,
    loadingText
}: LoadingButtonProps) {
    return (
        <button
            onClick={onClick}
            className="find-me-button"
        >
            {isLoading ? loadingText : buttonText}
        </button>
    );
};