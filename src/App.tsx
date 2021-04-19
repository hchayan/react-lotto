import React, { useRef, useState } from 'react';
import { AppWrapper } from './App.styles';

import PaymentForm from './components/PaymentForm/PaymentForm';
import RemainedTime from './components/RemainedTime/RemainedTime';
import TicketList from './components/TicketList/TicketList';
import WinningNumberForm from './components/WinningNumberForm/WinningNumberForm';
import ResultModal from './components/ResultModal/ResultModal';

import { issueTickets } from './services/tickets';

import ALERT_MESSAGE from './constants/alertMessage';

type State = {
  tickets: Ticket[];
  winningNumber: WinningNumber;
  isModalOpen: boolean;
};

const App = () => {
  const winningNumberFormRef = useRef<HTMLFormElement>(null);

  const [state, setState] = useState<State>({
    tickets: [],
    winningNumber: {
      numbers: [],
      bonus: 0,
    },
    isModalOpen: false,
  });

  const handlePayment = (payment: number) => {
    const tickets: Ticket[] = issueTickets(payment);
    setState({
      ...state,
      tickets,
    });
  };

  const handleWinningNumber = (winningNumber: WinningNumber) => {
    if (state.tickets.length === 0) {
      alert(ALERT_MESSAGE.SHOULD_BUY_TICKET);
      return;
    }

    setState({
      ...state,
      winningNumber,
    });

    handleModal(true);
  };

  const handleModal = (isOpen: boolean) => {
    setState({
      ...state,
      isModalOpen: isOpen,
    });
  };

  const resetGame = () => {
    setState({
      tickets: [],
      winningNumber: {
        numbers: [],
        bonus: 0,
      },
      isModalOpen: false,
    });

    winningNumberFormRef.current?.reset();
  };

  return (
    <AppWrapper display="flex">
      <h1 className="app-title">🎱 행운의 로또</h1>
      <PaymentForm handlePayment={handlePayment} />
      {state.tickets.length > 0 && <RemainedTime />}
      <TicketList tickets={state.tickets} />
      <WinningNumberForm handleWinningNumber={handleWinningNumber} formRef={winningNumberFormRef} />
      {state.isModalOpen && (
        <ResultModal
          handleModalClose={() => handleModal(false)}
          resetGame={resetGame}
          tickets={state.tickets}
          winningNumber={state.winningNumber}
        />
      )}
    </AppWrapper>
  );
};

export default App;
