import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce<Omit<Balance, 'total'>>(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            return {
              ...accumulator,
              income: accumulator.income + Number(transaction.value),
            };
          case 'outcome':
            return {
              ...accumulator,
              outcome: accumulator.outcome + Number(transaction.value),
            };
          default:
            return accumulator;
        }
      },
      { income: 0, outcome: 0 },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
