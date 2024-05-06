import { Button } from 'react-bootstrap';
import { FaMinus, FaPlus } from 'react-icons/fa';

const PlusMinusInput = ({value, onChange}: { value: string, onChange: (value: string) => void }) => {

  const increment = () => {
    let numValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
    numValue++;
    onChange(numValue.toString());
  };

  const decrement = () => {
    let numValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
    if (numValue > 0) {
      numValue--;
      onChange(numValue.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange('0');
    } else if (!isNaN(parseInt(inputValue))) {
      onChange(inputValue);
    }
  };

  return (
    <div className="center">
      <div className="input-group">
        <Button type="button" onClick={decrement}>
          <FaMinus />
        </Button>
        <input type="text" className="form-control" value={value} onChange={handleInputChange} style={{textAlign: 'center'}}/>
        <Button type="button" onClick={increment}>
          <FaPlus />
        </Button>
      </div>
    </div>
  );
};

export default PlusMinusInput;