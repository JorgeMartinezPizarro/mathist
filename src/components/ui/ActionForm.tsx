import { ReactNode } from "react";

import Spinner from "@/components/ui/Spinner";

interface ActionFormProps {
    onSubmit: () => void;
    loading: boolean;
    children: ReactNode;
}

// A row of fields and buttons. Enter or the submit button runs onSubmit.
const ActionForm = ({ onSubmit, loading, children }: ActionFormProps) =>
    <form
        className="action-form"
        onSubmit={event => {
            event.preventDefault()
            if (!loading) {
                onSubmit()
            }
        }}
    >
        {children}
        <Spinner loading={loading} />
    </form>

export default ActionForm;
