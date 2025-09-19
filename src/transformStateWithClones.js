'use strict';

/**
 * @param {Object} state
 * @param {Object[]} actions
 *
 * @return {Object[]}
 */
function transformStateWithClones(state, actions) {
  const actionsHistory = [{ ...state }];
  let status = false;

  for (const action of actions) {
    let changes = { ...actionsHistory.at(-1) };

    if (action.type === 'addProperties') {
      let wasChanged = false;

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
    }

    if (action.type === 'clear') {
      if (actionsHistory.length === 1 && !status) {
        actionsHistory[0] = {};
        status = true;
      } else {
        actionsHistory.push({});
      }
    }

    if (action.type === 'removeProperties') {
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
    }
  }

  return actionsHistory;
}
module.exports = transformStateWithClones;
