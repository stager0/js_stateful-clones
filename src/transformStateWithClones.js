'use strict';

/**
 * @param {Object} state
 * @param {Object[]} actions
 *
 * @return {string}
 */
function transformStateWithClones(state, actions) {
  const stateCopy = { ...state };
  const actionsHistory = [{ ...stateCopy }];
  let status = false;

  for (const action of actions) {
    let changes = { ...actionsHistory.at(-1) };
    let wasChanged = false;

    switch (action.type) {
      case 'addProperties':
        for (const act in action.extraData) {
          if (actionsHistory.length === 1 && !status) {
            actionsHistory[0][act] = action.extraData[act];
            wasChanged = true;
          } else {
            changes[act] = action.extraData[act];
          }
        }

        if (wasChanged) {
          status = true;
        }

        if (actionsHistory.length > 1) {
          actionsHistory.push({ ...changes });
          changes = {};
        }
        continue;

      case 'clear':
        if (actionsHistory.length === 1 && !status) {
          actionsHistory[0] = {};
          status = true;
        } else {
          actionsHistory.push({});
        }
        continue;

      case 'removeProperties':
        for (const key of action.keysToRemove) {
          if (key in changes) {
            delete changes[key];
          }
        }

        if (actionsHistory.length === 1 && !status) {
          actionsHistory[0] = { ...changes };
          status = true;
        } else {
          actionsHistory.push({ ...changes });
          changes = {};
        }
        continue;

      default:
        return 'Unknown action type: ' + action.type;
    }
  }

  return actionsHistory;
}
module.exports = transformStateWithClones;
