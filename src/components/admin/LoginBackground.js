export default function LoginBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/login-bg-clickcom-new.png')",
        }}
      />
      <div className="absolute inset-0 opacity-[0.24] [background-image:linear-gradient(115deg,rgba(11,121,208,0.18)_1px,transparent_1px),linear-gradient(65deg,rgba(255,122,0,0.12)_1px,transparent_1px)] [background-size:78px_78px,96px_96px]" />
      <div className="absolute inset-0 border border-white/20" />
    </div>
  );
}
