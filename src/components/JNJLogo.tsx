import clsx from "clsx";

interface JNJLogoProps {
	className?: string;
}

export const JNJLogo = ({ className }: JNJLogoProps) => {
	return (
		<svg
			viewBox="0 0 320 40"
			className={clsx("h-8 w-auto", className)}
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="28" letter-spacing="-1" fill="currentColor">Johnson &amp; Johnson</text>
		</svg>
	);
};
