import { forwardRef, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Toggle = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const beforePress = { display: visible ? 'none' : '' };
  const afterPress = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });

  return (
    <div className="toggle">
      <div className="label" style={beforePress}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={afterPress}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Toggle.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Toggle.displayName = 'Toggle';

export default Toggle;
