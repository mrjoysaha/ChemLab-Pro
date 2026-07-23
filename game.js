(function () {
"use strict";

const overlay   = document.getElementById("gameModalOverlay");
const modal     = document.getElementById("gameModal");
const closeBtn  = document.getElementById("gameModalClose");
const openBtn   = document.getElementById("gameMenuBtn");
const boardEl   = document.getElementById("gameBoard");
const boardWrap = document.getElementById("gameBoardWrap");
const winSvg    = document.getElementById("winLineSvg");
const statusEl  = document.getElementById("gameStatus");
const resetBtn  = document.getElementById("gameResetBtn");
const modeBtns  = document.querySelectorAll(".game-mode-btn");
const scoreXEl  = document.getElementById("scoreX");
const scoreOEl  = document.getElementById("scoreO");
const scoreDEl  = document.getElementById("scoreD");

if (overlay && boardEl){

  const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const state = {
    board: Array(9).fill(null),
    current: "X",
    mode: "single",   // "single" | "two"
    over: false,
    scores: { X: 0, O: 0, D: 0 }
  };

  // ---------- build the 9 cells once ----------
  const cells = [];
  for (let i = 0; i < 9; i++){
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "game-cell";
    cell.setAttribute("aria-label", "Cell " + (i+1));
    cell.addEventListener("click", () => handleCellClick(i));
    boardEl.appendChild(cell);
    cells.push(cell);
  }

  const MARK_X = '<svg viewBox="0 0 44 44"><path class="mark-path" d="M8 8 L36 36 M36 8 L8 36"/></svg>';
  const MARK_O = '<svg viewBox="0 0 44 44"><circle class="mark-path" cx="22" cy="22" r="14"/></svg>';

  // ---------- drawer "Game" button ----------
  if (openBtn) openBtn.addEventListener("click", openGameModal);

  function closeDrawerIfOpen(){
    const drawer = document.getElementById("siteDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const hamburger = document.getElementById("hamburgerBtn");
    if (drawer && drawer.classList.contains("open")){
      drawer.classList.remove("open");
      if (hamburger) hamburger.classList.remove("open");
      if (drawerOverlay){
        drawerOverlay.classList.remove("show");
        setTimeout(() => { drawerOverlay.hidden = true; }, 300);
      }
    }
  }

  function openGameModal(){
    closeDrawerIfOpen();
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    resetBoard();
  }
  function closeGameModal(){
    overlay.hidden = true;
    document.body.style.overflow = "";
  }
  if (closeBtn) closeBtn.addEventListener("click", closeGameModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeGameModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) closeGameModal(); });

  // ---------- mode switch ----------
  modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.mode = btn.dataset.mode;
      resetBoard();
    });
  });

  if (resetBtn) resetBtn.addEventListener("click", resetBoard);

  // ---------- core game logic ----------
  function resetBoard(){
    state.board = Array(9).fill(null);
    state.current = "X";
    state.over = false;
    cells.forEach(c => {
      c.innerHTML = "";
      c.classList.remove("filled","disabled","win-cell","mark-x","mark-o");
    });
    clearWinLine();
    updateStatus();
  }

  function handleCellClick(i){
    if (state.over || state.board[i]) return;
    if (state.mode === "single" && state.current === "O") return; // AI's turn, ignore clicks
    placeMark(i, state.current);
    if (!state.over && state.mode === "single" && state.current === "O"){
      cells.forEach(c => c.classList.add("disabled"));
      setTimeout(aiTurn, 420);
    }
  }

  function placeMark(i, player){
    state.board[i] = player;
    const cell = cells[i];
    cell.classList.remove("mark-x", "mark-o");
    cell.classList.add("filled", player === "X" ? "mark-x" : "mark-o");
    cell.innerHTML = player === "X" ? MARK_X : MARK_O;
    requestAnimationFrame(() => cell.querySelector(".mark-path").classList.add("drawn"));

    const result = checkResult(state.board);
    if (result){
      state.over = true;
      cells.forEach(c => c.classList.add("disabled"));
      if (result === "draw"){
        state.scores.D++;
        updateStatus("draw");
      } else {
        state.scores[result.winner]++;
        result.line.forEach(idx => cells[idx].classList.add("win-cell"));
        drawWinLine(result.line);
        updateStatus("win", result.winner);
      }
      updateScoreboard();
      return;
    }
    state.current = state.current === "X" ? "O" : "X";
    updateStatus();
    cells.forEach(c => { if (!c.classList.contains("filled")) c.classList.remove("disabled"); });
  }

  function checkResult(board){
    for (const line of WIN_LINES){
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]){
        return { winner: board[a], line };
      }
    }
    if (board.every(v => v)) return "draw";
    return null;
  }

  function updateStatus(kind, winner){
    if (!statusEl) return;
    if (kind === "win"){
      statusEl.innerHTML = `<span class="mark-label mark-label-${winner.toLowerCase()}">${winner}</span> wins!`;
      return;
    }
    if (kind === "draw"){
      statusEl.textContent = "It's a draw.";
      return;
    }
    const who = state.current;
    const label = `<span class="mark-label mark-label-${who.toLowerCase()}">${who}</span>`;
    if (state.mode === "single"){
      statusEl.innerHTML = who === "X" ? `Your turn — ${label}` : `Thinking — ${label}`;
    } else {
      statusEl.innerHTML = `Turn: ${label}`;
    }
  }

  function updateScoreboard(){
    if (scoreXEl) scoreXEl.textContent = state.scores.X;
    if (scoreOEl) scoreOEl.textContent = state.scores.O;
    if (scoreDEl) scoreDEl.textContent = state.scores.D;
  }

  function clearWinLine(){
    if (winSvg) winSvg.innerHTML = "";
  }

  function drawWinLine(line){
    if (!winSvg || !boardWrap) return;
    const wrapRect = boardWrap.getBoundingClientRect();
    winSvg.setAttribute("viewBox", `0 0 ${wrapRect.width} ${wrapRect.height}`);
    const a = cells[line[0]].getBoundingClientRect();
    const b = cells[line[2]].getBoundingClientRect();
    const x1 = a.left + a.width/2 - wrapRect.left;
    const y1 = a.top + a.height/2 - wrapRect.top;
    const x2 = b.left + b.width/2 - wrapRect.left;
    const y2 = b.top + b.height/2 - wrapRect.top;
    const lineEl = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineEl.setAttribute("x1", x1); lineEl.setAttribute("y1", y1);
    lineEl.setAttribute("x2", x2); lineEl.setAttribute("y2", y2);
    lineEl.setAttribute("class", "win-line");
    winSvg.innerHTML = "";
    winSvg.appendChild(lineEl);
    const len = Math.hypot(x2-x1, y2-y1);
    lineEl.style.strokeDasharray = len;
    lineEl.style.strokeDashoffset = len;
    requestAnimationFrame(() => { lineEl.style.strokeDashoffset = 0; });
  }

  // ---------- minimax AI (plays O, unbeatable) ----------
  function aiTurn(){
    if (state.over) return;
    const move = bestMove(state.board);
    if (move != null) placeMark(move, "O");
    cells.forEach(c => { if (!c.classList.contains("filled") && !state.over) c.classList.remove("disabled"); });
  }

  function bestMove(board){
    let best = -Infinity, moves = [];
    for (let i = 0; i < 9; i++){
      if (board[i]) continue;
      board[i] = "O";
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > best){ best = score; moves = [i]; }
      else if (score === best){ moves.push(i); }
    }
    return moves.length ? moves[Math.floor(Math.random()*moves.length)] : null;
  }

  function minimax(board, depth, isMaximizing){
    const result = checkResult(board);
    if (result === "draw") return 0;
    if (result && result.winner === "O") return 10 - depth;
    if (result && result.winner === "X") return depth - 10;

    if (isMaximizing){
      let best = -Infinity;
      for (let i = 0; i < 9; i++){
        if (board[i]) continue;
        board[i] = "O";
        best = Math.max(best, minimax(board, depth+1, false));
        board[i] = null;
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++){
        if (board[i]) continue;
        board[i] = "X";
        best = Math.min(best, minimax(board, depth+1, true));
        board[i] = null;
      }
      return best;
    }
  }

  updateStatus();
}
})();
