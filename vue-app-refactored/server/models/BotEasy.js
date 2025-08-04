import Bot from './Bot.js';

/**
 * Easy difficulty bot
 * @extends Bot
 */
export default class BotEasy extends Bot {
  /**
   * Create a new easy bot
   * @param {string} name - Bot name
   * @param {string|number} skin - Bot skin/avatar
   * @param {string} status - Bot status
   */
  constructor(name, skin, status) {
    super(name, skin, status, 1);
    
    // Bot strategy parameters
    this._tradeRate = 1.5;
    this._tradeIncrement = 0.2;
    this._maxRejectCount = 5;
    this._maxUpgradeCount = 5;
    this._minMoneyAfterTrade = 0;
    this._minMoneyAfterBuy = 0;
    this._stayInJailRound = 10;
    this._needBusiness = true;
    this._needService = true;
  }
  
  /**
   * Calculate bot's next action based on game state
   * @param {Object} game - Game state
   * @returns {string} Action to take
   */
  calcBotNextAction(game) {
    // Default simple strategy for easy bot
    if (this.jailtime > 0) {
      // In jail logic
      if (this.freecard > 0) {
        return 'useFreeCard';
      } else if (this.money > this.jaillimit) {
        return 'useFreeJail';
      }
    }
    
    if (!this.isUsedDice) {
      return 'dice';
    }
    
    // After dice logic
    if (game.isBuying && this.money > game.fm.buyPrice + this._minMoneyAfterBuy) {
      return 'buy';
    }
    
    // Basic property upgrade if we have enough money
    for (let i = 0; i < game.fm.props.length; i++) {
      if (game.fm.props[i].owner === this.name && 
          game.fm.props[i].upgrades < this._maxUpgradeCount && 
          this.money > game.fm.props[i].upgradeCost * 1.5) {
        this._upgradeIndex = i;
        return 'upgrade';
      }
    }
    
    // Default action if nothing else matches
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
    // Easy bot accepts trade if the payment is at least the property price
    return pay >= game.fm.props[selectedFieldIndex].price;
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
