import { truncateInTheMiddle } from './addressUtils';

export function capitalizeString(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

type AdjustTextByContainerWidth = Partial<{
  text: string;
  containerWidth: number;
  containerPadding2X: number;
  fontSize: number;
  fontFamily: string;
}>;

export const adjustTextByWidth = ({
  text = '',
  containerWidth = 0,
  fontSize = 16,
  fontFamily = 'IBM Plex Sans',
  containerPadding2X = 0,
}: AdjustTextByContainerWidth) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return text;
  }

  context.font = `${fontSize}px ${fontFamily}`;
  let adjustedText = text;
  let textWidth = context.measureText(text).width;
  let charsLeftOnSides = adjustedText.length / 2;

  while (textWidth >= containerWidth - containerPadding2X && charsLeftOnSides > 0) {
    context.font = `${fontSize}px ${fontFamily}`;
    adjustedText = truncateInTheMiddle(text, charsLeftOnSides);
    textWidth = context.measureText(adjustedText).width;
    charsLeftOnSides--;
  }

  return adjustedText;
};
