import React, { Component } from 'react';
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

export default class ResultModal extends Component<Props> {
  componentDidMount() {
    this.computeResult();
  }

  computeResult() {
    const { tickets, winningNumber } = this.props;
    const payment = tickets.length * TICKET.PRICE;
    const winnerCounts = getWinnerCounts(tickets, winningNumber);
    const profit = getTotalProfit(payment, winnerCounts);

    return { winnerCounts, profit };
  }

  render() {
    const { winnerCounts, profit } = this.computeResult();

    return (
      <Modal handleModalClose={this.props.handleModalClose}>
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
                {Object.values(RANK_INDEX).map(index => (
                  <ResultTableRow
                    match={MATCH[index]}
                    prize={PRIZE[index]}
                    matchCount={winnerCounts[index]}
                  />
                ))}
              </tbody>
            </ResultTable>
          </Wrapper>
          <p className="profit">수익률은 {profit}% 입니다.</p>
          <Wrapper display="flex">
            <Button type="reset" fullWidth onClick={this.props.resetGame}>
              다시 시작하기
            </Button>
          </Wrapper>
        </ResultModalWrapper>
      </Modal>
    );
  }
}
