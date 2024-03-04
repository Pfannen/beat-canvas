'use client'

import React, { FunctionComponent, ReactNode } from 'react';
import classes from './ImportExportLayout.module.css';
import MusicProvider from '@/components/providers/music';

interface ImportExportLayoutProps {
	children: ReactNode;
}

const ImportExportLayout: FunctionComponent<ImportExportLayoutProps> = ({
	children,
}) => {
	return <MusicProvider>{children}</MusicProvider>;
};

export default ImportExportLayout;
