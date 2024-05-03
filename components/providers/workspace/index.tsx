import useWorkspace from '@/components/hooks/workspace/useWorkspace';
import { FunctionComponent, ReactNode, createContext, useContext } from 'react';

type WorkspaceCtx = ReturnType<typeof useWorkspace>;

const WorkspaceContext = createContext<WorkspaceCtx>(
	useWorkspace.intitialState
);

type WorkspaceProviderProps = {
	children: ReactNode;
};

const WorkspaceProvider: FunctionComponent<WorkspaceProviderProps> = ({
	children,
}) => {
	const workspace = useWorkspace();

	return (
		<WorkspaceContext.Provider value={workspace}>
			{children}
		</WorkspaceContext.Provider>
	);
};

export default WorkspaceProvider;

export const useGlobalWorkspace = () => useContext(WorkspaceContext);
