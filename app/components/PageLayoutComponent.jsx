import HeaderComponent from "~/components/HeaderComponent.jsx";

export default function Layout({ children }) {
  return (
    <div style={{ backgroundColor: "#F3E5F5", minHeight: "100vh" }}>
      <HeaderComponent />
      <main>{children}</main>
    </div>
  );
}
