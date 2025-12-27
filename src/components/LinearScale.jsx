import './LinearScale.css';

function LinearScale({
    name,
    value,
    onChange,
    min = 1,
    max = 10,
    minLabel = 'Not at all',
    maxLabel = 'Very comfortable',
    error
}) {
    const options = [];
    for (let i = min; i <= max; i++) {
        options.push(i);
    }

    const handleSelect = (val) => {
        onChange({ target: { name, value: val.toString() } });
    };

    return (
        <div className={`linear-scale ${error ? 'has-error' : ''}`}>
            <div className="scale-labels">
                <span className="scale-label-min">{minLabel}</span>
                <span className="scale-label-max">{maxLabel}</span>
            </div>
            <div className="scale-options">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`scale-option ${value === option.toString() ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                        aria-label={`Rate ${option} out of ${max}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LinearScale;
