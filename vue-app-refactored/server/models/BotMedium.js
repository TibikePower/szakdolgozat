import Bot from './Bot.js';

/**
 * Medium difficulty bot
 * @extends Bot
 */
export default class BotMedium extends Bot {
  /**
   * Create a new medium bot
   * @param {string} name - Bot name
   * @param {string|number} skin - Bot skin/avatar
   * @param {string} status - Bot status
   */
  constructor(name, skin, status) {
    super(name, skin, status, 2);
    
    // Bot strategy parameters - medium has better defaults
    this._tradeRate = 1.3;
    this._tradeIncrement = 0.15;
    this._maxRejectCount = 5;
    this._maxUpgradeCount = 5;
    this._minMoneyAfterTrade = 5000;
    this._minMoneyAfterBuy = 2000;
    this._stayInJailRound = 8;
    this._needBusiness = true;
    this._needService = true;
  }
  
  /**
   * Calculate bot's next action based on game state
   * @param {Object} game - Game state
   * @returns {string} Action to take
   */
  calcBotNextAction(game) {
    // Medium bot has better jail strategy
    if (this.jailtime > 0) {
      if (this.freecard > 0) {
        return 'useFreeCard';
      } else if (this.money > this.jaillimit) {
        return 'useFreeJail';
      }
    }
    
    if (!this.isUsedDice) {
      return 'dice';
    }
    
    // After dice logic with more complex buying strategy
    if (game.isBuying && this.money > game.fm.buyPrice + this._minMoneyAfterBuy) {
      // Check if we're already close to completing a property group
      const propertyGroups = this._countPropertyGroupProgress(game);
      const mostCompletedGroup = this._getMostCompletedGroup(propertyGroups);
      
      if (game.fm.props[game.fm.activePropertyIndex].group === mostCompletedGroup) {
        return 'buy'; // Strategic purchase
      }
      
      return 'buy'; // Basic purchase
    }
    
    // More sophisticated property upgrade strategy
    const upgradeTarget = this._findBestUpgradeTarget(game);
    if (upgradeTarget !== -1) {
      this._upgradeIndex = upgradeTarget;
      return 'upgrade';
    }
    
    // Try trading if we have near complete property groups
    const tradeTarget = this._findTradeTarget(game);
    if (tradeTarget !== -1) {
      return 'wantProp';
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
    const groups = this._countPropertyGroupProgress(game);
    return this._getMostCompletedGroup(groups);
  }
  
  /**
   * Find the most completed property group
   * @param {Object} groups - Group progress mapping
   * @returns {number} Most completed group ID
   */
  _getMostCompletedGroup(groups) {
    let bestGroup = 0;
    let bestCompletion = 0;
    
    for (const groupId in groups) {
      const groupInfo = groups[groupId];
      const completion = groupInfo.owned / groupInfo.total;
      
      if (completion > bestCompletion) {
        bestCompletion = completion;
        bestGroup = parseInt(groupId);
      }
    }
    
    return bestGroup;
  }
  
  /**
   * Count progress on property groups
   * @param {Object} game - Game state
   * @returns {Object} Mapping of group IDs to progress
   */
  _countPropertyGroupProgress(game) {
    const groups = {};
    
    // Initialize group counters
    for (let i = 0; i < game.fm.props.length; i++) {
      const prop = game.fm.props[i];
      const groupId = prop.group;
      
      if (!groups[groupId]) {
        groups[groupId] = { total: 0, owned: 0 };
      }
      
      groups[groupId].total++;
      
      if (prop.owner === this.name) {
        groups[groupId].owned++;
      }
    }
    
    return groups;
  }
  
  /**
   * Find best property to upgrade
   * @param {Object} game - Game state
   * @returns {number} Property index to upgrade or -1 if none
   */
  _findBestUpgradeTarget(game) {
    // Find properties we own in complete groups
    const completeGroups = new Set();
    
    // Find complete groups first
    for (let groupId = 0; groupId < 8; groupId++) {
      let groupTotal = 0;
      let ownedInGroup = 0;
      
      for (let i = 0; i < game.fm.props.length; i++) {
        if (game.fm.props[i].group === groupId) {
          groupTotal++;
          if (game.fm.props[i].owner === this.name) {
            ownedInGroup++;
          }
        }
      }
      
      if (groupTotal === ownedInGroup && groupTotal > 0) {
        completeGroups.add(groupId);
      }
    }
    
    // Find cheapest property to upgrade in a complete group
    let bestProperty = -1;
    let bestValue = Number.MAX_SAFE_INTEGER;
    
    for (let i = 0; i < game.fm.props.length; i++) {
      const prop = game.fm.props[i];
      
      if (prop.owner === this.name && 
          completeGroups.has(prop.group) &&
          prop.upgrades < this._maxUpgradeCount &&
          this.money > prop.upgradeCost * 2) {
        
        // Value calculation - prefer lower upgrades first
        const value = prop.upgradeCost * (prop.upgrades + 1);
        
        if (value < bestValue) {
          bestValue = value;
          bestProperty = i;
        }
      }
    }
    
    return bestProperty;
  }
  
  /**
   * Find property to trade for
   * @param {Object} game - Game state
   * @returns {number} Property index or -1 if none
   */
  _findTradeTarget(game) {
    // Simple implementation
    return -1; // Not implemented in this example
  }
  
  /**
   * Check if bot accepts trade
   * @param {number} pay - Payment amount
   * @param {number} selectedFieldIndex - Field index for trade
   * @param {Object} game - Game state
   * @returns {boolean} Whether trade is accepted
   */
  isTradeAccept(pay, selectedFieldIndex, game) {
    // Medium bot has better trade strategy
    const propertyValue = game.fm.props[selectedFieldIndex].price;
    
    // Check if property would complete a group
    const groupId = game.fm.props[selectedFieldIndex].group;
    let ownedInGroup = 0;
    let totalInGroup = 0;
    
    for (let i = 0; i < game.fm.props.length; i++) {
      if (game.fm.props[i].group === groupId) {
        totalInGroup++;
        if (game.fm.props[i].owner === this.name) {
          ownedInGroup++;
        }
      }
    }
    
    // If this would complete a group, willing to pay more
    if (ownedInGroup === totalInGroup - 1) {
      return pay >= propertyValue * 1.1;
    }
    
    // Standard trade evaluation
    return pay >= propertyValue * 1.2;
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
