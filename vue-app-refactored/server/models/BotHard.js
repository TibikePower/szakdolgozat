import Bot from './Bot.js';

/**
 * Hard difficulty bot
 * @extends Bot
 */
export default class BotHard extends Bot {
  /**
   * Create a new hard bot
   * @param {string} name - Bot name
   * @param {string|number} skin - Bot skin/avatar
   * @param {string} status - Bot status
   */
  constructor(name, skin, status) {
    super(name, skin, status, 3);
    
    // Bot strategy parameters - hard has best defaults
    this._tradeRate = 1.2;
    this._tradeIncrement = 0.1;
    this._maxRejectCount = 5;
    this._maxUpgradeCount = 5;
    this._minMoneyAfterTrade = 10000;
    this._minMoneyAfterBuy = 5000;
    this._stayInJailRound = 5;
    this._needBusiness = true;
    this._needService = true;
  }
  
  /**
   * Calculate bot's next action based on game state
   * @param {Object} game - Game state
   * @returns {string} Action to take
   */
  calcBotNextAction(game) {
    // Hard bot has most advanced strategy
    // This would be implemented with more complex logic
    return 'nextTurn';
  }
  
  /**
   * Count property groups owned by bot
   * @param {Object} game - Game state
   * @returns {number} Group count
   */
  countGroup(game) {
    const groups = new Set();
    
    for (let i = 0; i < game.fm.props.length; i++) {
      if (game.fm.props[i].owner === this.name) {
        groups.add(game.fm.props[i].group);
      }
    }
    
    return groups.size > 0 ? Array.from(groups)[0] : 0;
  }
  
  /**
   * Check if bot accepts trade
   * @param {number} pay - Payment amount
   * @param {number} selectedFieldIndex - Field index for trade
   * @param {Object} game - Game state
   * @returns {boolean} Whether trade is accepted
   */
  isTradeAccept(pay, selectedFieldIndex, game) {
    // Hard bot has complex trade strategy
    return pay >= game.fm.props[selectedFieldIndex].price * 1.5;
  }
  
  /**
   * Set bot parameters
   * @param {Object} parameters - Bot parameters
   */
  parameters(parameters) {
    if (parameters.tradeRate !== undefined) this._tradeRate = parameters.tradeRate;
    if (parameters.tradeIncrement !== undefined) this._tradeIncrement = parameters.tradeIncrement;
    if (parameters.maxRejectCount !== undefined) this._maxRejectCount = parameters.maxRejectCount;
    if (parameters.maxUpgradeCount !== undefined) this._maxUpgradeCount = parameters.maxUpgradeCount;
    if (parameters.minMoneyAfterTrade !== undefined) this._minMoneyAfterTrade = parameters.minMoneyAfterTrade;
    if (parameters.minMoneyAfterBuy !== undefined) this._minMoneyAfterBuy = parameters.minMoneyAfterBuy;
    if (parameters.stayInJailRound !== undefined) this._stayInJailRound = parameters.stayInJailRound;
    if (parameters.needBusiness !== undefined) this._needBusiness = parameters.needBusiness;
    if (parameters.needService !== undefined) this._needService = parameters.needService;
  }
}
