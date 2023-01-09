export function createNewObject(currentObj, keyName, inputValue) {
  let newTrailObj = {
    ...currentObj,
  };

  const keyPath = findKeyPath(currentObj, keyName);

  // TODO: Find a better way to create object key path for value assignment
  if (keyPath === '') newTrailObj[keyName] = inputValue;
  if (keyPath === 'facts') {
    newTrailObj.facts[keyName] = inputValue;
  }
  if (keyPath === 'facts.time') {
    const timePropKeyPath = newTrailObj.facts.time;

    timePropKeyPath[keyName] = inputValue;

    if (timePropKeyPath.timeType.trim() === '') {
      timePropKeyPath.timeType = 'hours';
    }
  }
  if (keyPath === 'facts.elevation')
    newTrailObj.facts.elevation[keyName] = inputValue;
  if (keyPath === 'temperatures.summer')
    newTrailObj.temperatures.summer[keyName] = inputValue;
  if (keyPath === 'temperatures.autumn')
    newTrailObj.temperatures.autumn[keyName] = inputValue;
  if (keyPath === 'temperatures.winter')
    newTrailObj.temperatures.winter[keyName] = inputValue;
  if (keyPath === 'temperatures.spring')
    newTrailObj.temperatures.spring[keyName] = inputValue;
  // TODO end

  return newTrailObj;
}

function findKeyPath(trailObj, key) {
  let path = [];

  function keyExists(obj) {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (obj.hasOwnProperty(key)) {
      return true;
    }

    for (const k in obj) {
      path.push(k);
      const result = keyExists(obj[k]);
      if (result) {
        return result;
      }
      path.pop();
    }

    return false;
  }

  keyExists(trailObj);

  return path.join('.');
}
