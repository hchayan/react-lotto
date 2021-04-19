import React, { useState, useEffect } from 'react';
import { ResultModalWrapper, ResultTable } from './ResultModal.styles';
import ResultTableRow from './ResultTableRow/ResultTableRow';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Wrapper from '../common/Wrapper';
import TICKET from '../../constants/ticket';
import { getTotalProfit, getWinnerCounts } from '../../services/game';
import { MATCH, PRIZE, RANK_INDEX } from '../../constants/game';

type Props = {
  handleModalClose: () => void;
  resetGame: () => void;
  tickets: Ticket[];
  winningNumber: WinningNumber;
};

type State = {
  firstWinnerCount: number;
  secondWinnerCount: number;
  thirdWinnerCount: number;
  fourthWinnerCount: number;
  fifthWinnerCount: number;
  profit: number;
};

const ResultModal = ({ handleModalClose, resetGame, tickets, winningNumber }: Props) => {
  const [component, setComponent] = useState<State>({
    firstWinnerCount: 0,
    secondWinnerCount: 0,
    thirdWinnerCount: 0,
    fourthWinnerCount: 0,
    fifthWinnerCount: 0,
    profit: 0,
  });

  const computeResult = () => {
    const payment = tickets.length * TICKET.PRICE;
    const winnerCounts = getWinnerCounts(tickets, winningNumber);
    const profit = getTotalProfit(payment, winnerCounts);

    setComponent({
      firstWinnerCount: winnerCounts[0],
      secondWinnerCount: winnerCounts[1],
      thirdWinnerCount: winnerCounts[2],
      fourthWinnerCount: winnerCounts[3],
      fifthWinnerCount: winnerCounts[4],
      profit,
    });
  };

  useEffect(() => {
    computeResult();
  });

  return (
    <Modal handleModalClose={handleModalClose}>
      <ResultModalWrapper>
        <h2 className="result-header">🏆 당첨 통계 🏆</h2>
        <Wrapper display="flex">
          <ResultTable>
            <thead>
              <tr>
                <th>일치 갯수</th>
                <th>당첨금</th>
                <th>당첨 갯수</th>
              </tr>
            </thead>
            <tbody>
              <ResultTableRow
                match={MATCH[RANK_INDEX.FIFTH]}
                prize={PRIZE[RANK_INDEX.FIFTH]}
                matchCount={component.fifthWinnerCount}
              />
              <ResultTableRow
                match={MATCH[RANK_INDEX.FOURTH]}
                prize={PRIZE[RANK_INDEX.FOURTH]}
                matchCount={component.fourthWinnerCount}
              />
              <ResultTableRow
                match={MATCH[RANK_INDEX.THIRD]}
                prize={PRIZE[RANK_INDEX.THIRD]}
                matchCount={component.thirdWinnerCount}
              />
              <ResultTableRow
                isBonus
                match={MATCH[RANK_INDEX.SECOND]}
                prize={PRIZE[RANK_INDEX.SECOND]}
                matchCount={component.secondWinnerCount}
              />
              <ResultTableRow
                match={MATCH[RANK_INDEX.FIRST]}
                prize={PRIZE[RANK_INDEX.FIRST]}
                matchCount={component.firstWinnerCount}
              />
            </tbody>
          </ResultTable>
        </Wrapper>
        <p className="profit">수익률은 {component.profit}% 입니다.</p>
        <Wrapper display="flex">
          <Button type="reset" fullWidth onClick={resetGame}>
            다시 시작하기
          </Button>
        </Wrapper>
      </ResultModalWrapper>
    </Modal>
  );
};

export default ResultModal;
