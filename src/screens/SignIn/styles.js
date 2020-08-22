import styled from 'styled-components/native';
import { colorTheme } from '../../constants';

export const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF;
`;

export const BotaoSecreto = styled.TouchableWithoutFeedback`

`;

export const HeaderContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const InputsContainer = styled.View`
  z-index: 3;
  flex: 2;
  width: 100%;
  justify-content: center;
  margin-top: 40px;
`;

export const BottomContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`;
export const TextBottom = styled.Text`
  color: ${colorTheme};
  font-size: 16px;
  font-family: "Nunito";
`;

export const TextBottomButton = styled.Text`
  font-family: "Nunito-Bold";
  color: ${colorTheme};
  font-size: 16px;
`;

export const TextBottomContainer = styled.View`
  flex-direction: row;
  margin-top: 20px;
`;

export const LoginRegisterLink = styled.TouchableWithoutFeedback`
  
`


