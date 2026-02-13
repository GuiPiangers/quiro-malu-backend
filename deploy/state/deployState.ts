let deployInProgress = false;

export function isDeployInProgress() {
  return deployInProgress;
}

export function setDeployInProgress(inProgress: boolean) {
  deployInProgress = inProgress;
}
