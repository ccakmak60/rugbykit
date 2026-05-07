function Cone({ position }: { position: [number, number, number] }) {
  return (
    <mesh castShadow position={position}>
      <coneGeometry args={[0.18, 0.48, 16]} />
      <meshStandardMaterial color="#ff7a59" roughness={0.5} />
    </mesh>
  );
}

function TackleBag({ position, color = '#17251d' }: { position: [number, number, number]; color?: string }) {
  return (
    <mesh castShadow position={position} rotation-z={Math.PI / 2}>
      <capsuleGeometry args={[0.28, 1.3, 12, 18]} />
      <meshStandardMaterial color={color} roughness={0.58} />
    </mesh>
  );
}

function ScrumSled({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[1.7, 0.3, 0.75]} />
        <meshStandardMaterial color="#25372d" roughness={0.62} />
      </mesh>
      <mesh castShadow position={[-0.7, 0.72, 0]}>
        <boxGeometry args={[0.24, 0.82, 0.75]} />
        <meshStandardMaterial color="#b8ff6a" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0.7, 0.72, 0]}>
        <boxGeometry args={[0.24, 0.82, 0.75]} />
        <meshStandardMaterial color="#b8ff6a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function StadiumLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 4.8, 12]} />
        <meshStandardMaterial color="#8fa79a" roughness={0.42} metalness={0.25} />
      </mesh>
      <mesh castShadow position={[0, 4.92, 0]}>
        <boxGeometry args={[1.1, 0.25, 0.32]} />
        <meshStandardMaterial color="#eef7ef" emissive="#b8ff6a" emissiveIntensity={0.35} roughness={0.25} />
      </mesh>
      <pointLight position={[0, 4.6, 0]} intensity={0.55} color="#dffff0" distance={14} />
    </group>
  );
}

function TrainingGroundProps() {
  return (
    <group>
      {[-10, -8.8, -7.6, 6.8, 8, 9.2].map((x, index) => <Cone key={index} position={[x, 0.24, index < 3 ? -7.2 : 7.2]} />)}
      <TackleBag position={[-12.4, 0.42, -3.4]} color="#25372d" />
      <TackleBag position={[-12.4, 0.42, -2.1]} color="#31483a" />
      <TackleBag position={[12.5, 0.42, 3.1]} color="#25372d" />
      <ScrumSled position={[11.8, 0, -5.7]} />
      <StadiumLight position={[-14.2, 0, -8.2]} />
      <StadiumLight position={[14.2, 0, 8.2]} />
    </group>
  );
}

export { TrainingGroundProps };
