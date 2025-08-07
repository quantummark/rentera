import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCanvasProps {
  onSave: (signatureData: string) => void;  // Функция для сохранения подписи
}

const SignatureCanvasComponent: React.FC<SignatureCanvasProps> = ({ onSave }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const saveSignature = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL();  // Получаем подпись в формате base64
      onSave(signatureData);  // Отправляем подпись на сохранение
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-lg font-semibold mb-4">{`Подпись`}</h3>
      
      <div className="relative w-full max-w-xl p-4 bg-white shadow-lg rounded-lg">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: 500,
            height: 200,
            className: 'border-2 border-gray-400 rounded-md shadow-md',
          }}
        />
      </div>

      <div className="mt-4 space-x-2">
        <button
          onClick={saveSignature}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          Сохранить подпись
        </button>
        <button
          onClick={clearSignature}
          className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-all"
        >
          Очистить
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvasComponent;
