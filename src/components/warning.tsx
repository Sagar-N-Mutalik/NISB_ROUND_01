import React from 'react';

const Warning: React.FC = () => {
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return visible ? (
        <div
            style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #ffeeba',
                margin: '16px 0',
                fontWeight: 'bold',
                textAlign: 'center',
            }}
        >
            ⚠️ Refreshing is not allowed. If you refresh, your answers will be invalid and you have to restart the game.
        </div>
    ) : null;
};

export default Warning;