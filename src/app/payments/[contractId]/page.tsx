import PaymentsPage from '../components/PaymentsPage';

export default function Page({ params }: { params: { contractId: string } }) {
  return <PaymentsPage mode="contract" contractId={params.contractId} />;
}
