import { Button } from '../shared/components/Button.jsx';
import { EmptyState } from '../shared/components/EmptyState.jsx';

export const NotFoundPage = () => (
  <main id="contenido" style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24 }}>
    <EmptyState title="Esta página no existe" action={<Button to="/">Volver al inicio</Button>}>
      Puede que el link esté incompleto. Si alguien le compartió su ahorro, pídale que se lo mande otra vez.
    </EmptyState>
  </main>
);
