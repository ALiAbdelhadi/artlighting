type ProductFeaturesProps = {
  specificationsTable: {
    [key: string]: string;
  };
};

export default function ProductFeatures({
  specificationsTable,
}: ProductFeaturesProps) {
  return (
    <div className="mt-6">
      <h2 className="sm:text-2xl text-xl font-semibold mb-3">Features :</h2>
      <ul>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>Energy Efficiency Champion : </strong> Reduce your electricity
          bill and your carbon footprint by up to
          {specificationsTable["Energy Saving"]} compared to traditional lighting
          with this spotlight&apos;s exceptional energy efficiency.
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>Built to Last : </strong> Enjoy years of maintenance-free
          illumination with the spotlight&apos;s extended lifespan, lasting{" "}
          {specificationsTable["Life Time"]} Life time 25 times longer than
          standard halogen lamps.
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          {parseInt(specificationsTable["IP"]) >= 44 ? (
            <strong>Weatherproof Warrior :</strong>
          ) : (
            <strong>Indoor Haven :</strong>
          )}
          {parseInt(specificationsTable["IP"]) >= 44
            ? `Embrace outdoor applications, knowing your spotlight is shielded from the elements thanks to its ${specificationsTable["IP"]} water and dust resistance rating.`
            : `Illuminate your home or office safely with a design crafted for Indoor lighting ًWith IP ${specificationsTable["IP"]}. Keep it shielded from outdoor elements to preserve its optimal brightness.`}
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>Illuminating Powerhouse :</strong> Tailor your lighting to any
          space with the spotlight&apos;s impressive brightness of up to{" "}
          {specificationsTable["Luminous Flux"]} lumens, perfect for both general
          and task lighting
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>Wide-Reaching Illumination :</strong> Achieve uniform and even
          lighting across larger areas with the spotlight&apos;s expansive beam
          angle of
          {specificationsTable["Beam Angle"]} degrees.
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>Climate Conqueror :</strong>Install your spotlight with
          confidence in diverse environments, as it thrives in temperatures
          ranging from
          {specificationsTable["Working Temperature"]}.
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>True Color Specialist :</strong>Experience exceptional color
          accuracy with the spotlight&apos;s high CRI, ideal for applications
          demanding precise color rendering.
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>Effortless Installation :</strong>Simplify your setup with the
          spotlight&apos;s user-friendly installation process, requiring no
          special tools or expertise.
        </li>
        <li className="text-muted-foreground md:text-lg text-[1.1rem] md:leading-9 leading-6 tracking-wide">
          <strong>Built to Endure :</strong>Invest in lasting performance with the
          spotlight&apos;s robust design, able to withstand shocks and vibrations
          without compromising function.
        </li>
      </ul>
    </div>
  )
}