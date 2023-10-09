import Header from 'components/header'

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <>
    <Header></Header>
    <main>{children}</main>
    </>
  );
}
