import { reactive } from 'vue';

export const position = reactive({
  x: 0,
  y: 0,
});

let _isMousedown = false;
const _last = {
  x: 0,
  y: 0,
};
/** 边界 */
const _boundary = {
  min: {
    x: 0,
    y: 0,
  },
  max: {
    x: 0,
    y: 0,
  },
};

const _getBoundaryInfo = (ballRef: HTMLElement | undefined) => {
  const bodyRect = document.body.getBoundingClientRect();
  _boundary.min.x = 0;
  _boundary.min.y = 0;
  _boundary.max.x = bodyRect.width;
  _boundary.max.y = bodyRect.height;

  if (ballRef) {
    const ballRect = ballRef.getBoundingClientRect();

    const d = 0;

    _boundary.min.x -= (ballRect.left - position.x);
    _boundary.min.x -= d;
    _boundary.min.y -= (ballRect.top - position.y);
    _boundary.min.y -= d;

    _boundary.max.x -= (ballRect.left - position.x);
    _boundary.max.x -= (ballRect.width - d);
    _boundary.max.y -= (ballRect.top - position.y);
    _boundary.max.y -= (ballRect.height - d);
  }
};

export const onballmousedown = (e: MouseEvent, ballRef: HTMLElement | undefined) => {
  if (!ballRef) return;
  _getBoundaryInfo(ballRef);
  _last.x = e.clientX;
  _last.y = e.clientY;
  _isMousedown = true;
};

export const ondocumentmouseup = () => {
  _isMousedown = false;
};

export const ondocumentmousemove = (e: MouseEvent) => {
  if (!_isMousedown) return;

  position.x += e.clientX - _last.x;
  position.y += e.clientY - _last.y;

  if (position.x < _boundary.min.x) position.x = _boundary.min.x;
  if (position.y < _boundary.min.y) position.y = _boundary.min.y;
  if (position.x > _boundary.max.x) position.x = _boundary.max.x;
  if (position.y > _boundary.max.y) position.y = _boundary.max.y;

  _last.x = e.clientX;
  _last.y = e.clientY;
};

export const initPosition = () => {
  position.x = 0;
  position.y = 0;
};

export default {
  position,
  onballmousedown,
  ondocumentmouseup,
  ondocumentmousemove,
  initPosition,
};
