import Hero from "../components/Hero";
import KontakForm from "../components/kontak-form";
import Fitur from "../components/fitur";
import TentangKami from "../components/tentang-kami";
import Simulasi from "../components/simulasi";

export default function Welcome() {
  return (
    <>
      <Hero />
      <TentangKami />
      <Fitur />
      <Simulasi />
      <KontakForm />
    </>
  );
}
