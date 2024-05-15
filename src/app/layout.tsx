'use client';

import {
	QueryClientProvider,
} from '@tanstack/react-query'

import './global.css';
import { queryClient } from './client';
import { StyledJsxRegistry } from './registry';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<body>
				<QueryClientProvider client={queryClient}>
					<StyledJsxRegistry>{children}</StyledJsxRegistry>
				</QueryClientProvider>
			</body>
		</html>
	);
}
