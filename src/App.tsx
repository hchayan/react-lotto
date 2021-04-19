import React, { useRef, useState } from 'react';
import { AppWrapper } from './App.styles';

import PaymentForm from './components/PaymentForm/PaymentForm';
import RemainedTime from './components/RemainedTime/RemainedTime';
import TicketList from './components/TicketList/TicketList';
import WinningNumberForm from './components/WinningNumberForm/WinningNumberForm';
import ResultModal from './components/ResultModal/ResultModal';

import { issueTickets } from './services/tickets';
import { getRemainedTime } from './utils/date';

import ALERT_MESSAGE from './constants/alertMessage';
import { GREENWICH_MILLISECONDS, TIMER_TICK } from './constants/timer';

type State = {
  tickets: Ticket[];
  winningNumber: WinningNumber;
  isModalOpen: boolean;
  remainTime: Date | null;
};

const App = () => {
  const winningNumberFormRef = useRef<HTMLFormElement>(null);
  const [remainTimer, setRemainTimer] = useState<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<State>({
    tickets: [],
    winningNumber: {
      numbers: [],
      bonus: 0,
    },
    isModalOpen: false,
    remainTime: null,
  });

  const tickRemainTime = () => {
    setState({
      ...state,
      remainTime: new Date(getRemainedTime() - GREENWICH_MILLISECONDS),
    });
  };

  const handleRemainedTime = () => {
    tickRemainTime();
    setRemainTimer(
      setInterval(() => {
        tickRemainTime();
      }, TIMER_TICK)
    );
  };

  const handlePayment = (payment: number) => {
    const tickets: Ticket[] = issueTickets(payment);
    setState({
      ...state,
      tickets,
    });

    handleRemainedTime();
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
      remainTime: null,
    });

    winningNumberFormRef.current?.reset();
    remainTimer && clearInterval(remainTimer);
  };

  return (
    <AppWrapper display="flex">
      <h1 className="app-title">🎱 행운의 로또</h1>
      <PaymentForm handlePayment={handlePayment} />
      {state.remainTime && <RemainedTime remainTime={state.remainTime} />}
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
