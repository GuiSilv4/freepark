export default function validations(userData, stageNew) {

  const validations = [];

  //validacoes quando eh registro
  if (stageNew) {
    validations.push(userData.password === userData.confirmPassword);
    validations.push(userData.name && userData.name.length > 1);
  }

  validations.push(userData.email && userData.email.includes('@'));
  validations.push(userData.email && userData.email.includes('.'));
  validations.push(userData.password && userData.password.length >= 6);

  const result = validations.reduce(
    (acumulado, valorAtual) => acumulado && valorAtual);

  return result;
}
