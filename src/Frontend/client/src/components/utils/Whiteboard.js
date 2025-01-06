import React, { useState, useEffect, useRef } from 'react';
import styles from './Whiteboard.module.css';

const Whiteboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    subject: '',
    labName: '',
    text: '',
    deadline: '',
    priority: 'medium'
  });
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [isWhiteTheme, setIsWhiteTheme] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const colors = [
    '#000000', '#FF0000', '#00FF00', 
    '#0000FF', '#FF00FF', '#FFFF00'
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  // Drawing functions
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = nativeEvent;
    if (isEraser) {
      contextRef.current.globalCompositeOperation = 'destination-out';
      contextRef.current.lineWidth = 20;
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.strokeStyle = currentColor;
      contextRef.current.lineWidth = 5;
    }
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = isWhiteTheme ? 'white' : '#2c2c2c';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.text.trim() || !newTask.labName.trim()) return;

    try {
      const task = {
        id: Date.now(),
        ...newTask,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask({
        subject: '',
        labName: '',
        text: '',
        deadline: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className={styles.whiteboardContainer}>
      <div className={`${styles.whiteboard} ${!isWhiteTheme && styles.darkTheme}`}>
        <h1 className={styles.boardTitle}>Digital Whiteboard</h1>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          className={styles.canvas}
        />

        <div className={styles.toolsPanel}>
          <div className={styles.colorPicker}>
            {colors.map(color => (
              <button
                key={color}
                className={`${styles.colorButton} ${currentColor === color ? styles.active : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setCurrentColor(color);
                  setIsEraser(false);
                }}
              />
            ))}
          </div>
          
          <button 
            className={`${styles.toolButton} ${isEraser ? styles.active : ''}`}
            onClick={() => setIsEraser(true)}
            title="Eraser"
          >
            🧼
          </button>

          <button 
            className={styles.toolButton}
            onClick={clearCanvas}
            title="Clear Board"
          >
          🗑️
          </button>

          <button 
            className={styles.toolButton}
            onClick={() => setIsWhiteTheme(!isWhiteTheme)}
            title="Toggle Theme"
          >
        {isWhiteTheme ? '🌙' : '☀️'}
          </button>
        </div>

        <div className={styles.todoOverlay}>
          <div className={styles.todoHeader}>
            <h3>Lab Tasks</h3>
          </div>
          
          <form onSubmit={addTask} className={styles.addTaskForm}>
            <input
              type="text"
              value={newTask.labName}
              onChange={(e) => setNewTask({ ...newTask, labName: e.target.value })}
              placeholder="Enter Lab Name"
              className={styles.input}
              required
            />

            <input
              type="text"
              value={newTask.subject}
              onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
              placeholder="Subject"
              className={styles.input}
              required
            />

            <textarea
              value={newTask.text}
              onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
              placeholder="Task description"
              className={styles.textarea}
              required
            />

            <div className={styles.taskDetails}>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className={styles.input}
                required
              />

              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className={styles.select}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <button type="submit" className={styles.addButton}>
              Add Task
            </button>
          </form>

          <div className={styles.taskList}>
            {tasks.map(task => (
              <div key={task.id} className={`${styles.taskItem} ${styles[task.priority]}`}>
                <div className={styles.taskHeader}>
                  <span className={styles.labName}>{task.labName}</span>
                  <span className={styles.deadline}>
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.subject}>{task.subject}</div>
                <div className={styles.taskText}>{task.text}</div>
                <button
                  className={styles.deleteTask}
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;