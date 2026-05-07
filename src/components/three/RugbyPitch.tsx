function RugbyPitch() {
  const lineMaterial = <meshBasicMaterial color="#eef7ef" transparent opacity={0.78} />;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[34, 20]} />
        <meshStandardMaterial color="#14552a" roughness={0.88} metalness={0.02} />
      </mesh>
      {[-15, -10, -5, 0, 5, 10, 15].map((x) => (
        <mesh key={x} position={[x, 0.018, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.06, 20]} />
          {lineMaterial}
        </mesh>
      ))}
      {[-9, 0, 9].map((z) => (
        <mesh key={z} position={[0, 0.02, z]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[34, 0.05]} />
          {lineMaterial}
        </mesh>
      ))}
      <mesh position={[-16.2, 0.08, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.18, 18]} />
        <meshBasicMaterial color="#b8ff6a" transparent opacity={0.72} />
      </mesh>
      <mesh position={[16.2, 0.08, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.18, 18]} />
        <meshBasicMaterial color="#f1c94b" transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

export { RugbyPitch };
