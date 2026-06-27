import React from 'react';

const SeatMap = ({ seats, selectedSeats, onSeatClick, maxSelectable }) => {
  const seatDict = {};
  seats.forEach((s) => {
    seatDict[s.seatNumber] = s;
  });

  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const renderSeat = (seatNumber) => {
    const seat = seatDict[seatNumber];
    if (!seat) return <div key={seatNumber} className="seat-item empty" style={{ visibility: 'hidden', width: '32px' }} />;

    const isSelected = selectedSeats.includes(seatNumber);
    const isBooked = seat.status === 'BOOKED';
    const isLocked = seat.status === 'LOCKED';

    let className = 'seat-item';
    if (isSelected) {
      className += ' selected';
    } else if (isBooked) {
      className += ' booked';
    } else if (isLocked) {
      className += ' locked';
    } else {
      className += ' available ' + seat.seatClass.toLowerCase();
    }

    const handleClick = () => {
      if (isBooked || isLocked) return;
      onSeatClick(seatNumber);
    };

    return (
      <div
        key={seatNumber}
        className={className}
        onClick={handleClick}
        title={seatNumber + ' - ' + seat.seatClass}
      >
        {seatNumber}
      </div>
    );
  };

  return (
    <div className="seat-map-wrapper">
      <div className="cabin-screen">FRONT OF AIRCRAFT</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {rows.map((row) => {
          const isBusiness = row <= 2;
          return (
            <div key={row} className="seat-row">
              <span className="row-number">{row}</span>
              
              {isBusiness ? (
                <>
                  {renderSeat(row + 'A')}
                  {renderSeat(row + 'B')}
                  <div className="seat-aisle" style={{ width: '48px' }} />
                  {renderSeat(row + 'E')}
                  {renderSeat(row + 'F')}
                </>
              ) : (
                <>
                  {renderSeat(row + 'A')}
                  {renderSeat(row + 'B')}
                  {renderSeat(row + 'C')}
                  <div className="seat-aisle" />
                  {renderSeat(row + 'D')}
                  {renderSeat(row + 'E')}
                  {renderSeat(row + 'F')}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#6366f1' }} />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }} />
          <span>Locked</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)' }} />
          <span>Business</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)' }} />
          <span>Premium Econ</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.4)' }} />
          <span>Economy</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;

