import React ,{ useState, useEffect} from 'react';

function UndoFooter({message,onUndo,duration=3000}) {
    const [visible,setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if(!visible) return null;

    return(
        <div className="undo-footer">
            {message}
            <button onClick={onUndo}>Undo</button>
        </div>
    );
}

export default UndoFooter;