"use client";

import { Icon } from "@iconify/react";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-auto w-full py-6 border-t border-border/60 bg-background">
			<div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground px-6">
				<div className="flex items-center gap-1">
					<span>
						&copy; {currentYear} Wiz Ofuasia (Wizboyy) — Wizolingo Music. All rights
						reserved.
					</span>
				</div>

				<div className="flex items-center gap-4">
					<a
						href="https://www.youtube.com/@wiz_ofuasia"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="YouTube"
						className="hover:text-primary transition-colors"
					>
						<Icon icon="lucide:youtube" className="h-4 w-4" />
					</a>
					<a
						href="https://www.instagram.com/wizofuasia/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						className="hover:text-primary transition-colors"
					>
						<Icon icon="lucide:instagram" className="h-4 w-4" />
					</a>
					<a
						href="https://www.threads.com/@wizofuasia"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Threads"
						className="hover:text-primary transition-colors"
					>
						<Icon icon="lucide:disc-3" className="h-4 w-4" />
					</a>
				</div>
			</div>
		</footer>
	);
}

