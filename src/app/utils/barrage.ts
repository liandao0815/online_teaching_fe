export interface IBarrage {
  add: (value: string, color: string) => void;
  draw: () => void;
  clear: () => void;
}

export interface BarrageItem {
  value: string;
  color: string;
  offset: number;
  width: number;
  top: number;
  left: number;
}

export interface BarrageOptions {
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  multiColor?: boolean;
}

export default class Barrage implements IBarrage {
  private width: number;
  private height: number;
  private context: CanvasRenderingContext2D;
  private barrageList: BarrageItem[];
  private canvasRaf: number;
  // 默认弹幕选项
  private options: BarrageOptions = {
    fontSize: '20px',
    fontFamily: 'Microsoft YaHei',
    color: '#ffffff',
    multiColor: false
  };

  constructor(canvas: HTMLCanvasElement, barrageOptions?: BarrageOptions) {
    const canvasClientRect = canvas.getBoundingClientRect();

    this.width = canvasClientRect.right - canvasClientRect.left;
    this.height = canvasClientRect.bottom - canvasClientRect.top;
    this.context = canvas.getContext('2d');
    this.barrageList = [];
    this.options = { ...this.options, ...barrageOptions };

    this.context.font = `${this.options.fontSize} ${this.options.fontFamily}`;
  }

  add(value: string): void {
    const left = this.width;
    const top = this.getTop();
    const offset = this.getOffset();
    const width = Math.ceil(this.context.measureText(value).width);
    const color = this.options.multiColor ? this.getMultiColor() : this.options.color;

    const barrageItem: BarrageItem = { value, left, top, offset, width, color };
    this.barrageList.push(barrageItem);
  }

  draw(): void {
    if (this.barrageList.length) {
      const tempBarrageList: BarrageItem[] = [];

      this.context.clearRect(0, 0, this.width, this.height);
      this.barrageList.forEach(b => {
        if (b.left + b.width > 0) {
          b.left -= b.offset;
          this.drawText(b);
          tempBarrageList.push(b);
        }
      });
      this.barrageList = tempBarrageList;
    }

    this.canvasRaf = requestAnimationFrame(this.draw.bind(this));
  }

  clear(): void {
    if (this.canvasRaf) {
      cancelAnimationFrame(this.canvasRaf);
      this.context.clearRect(0, 0, this.width, this.height);
      this.barrageList = [];
    }
  }

  private drawText(barrageItem: BarrageItem): void {
    this.context.fillStyle = barrageItem.color;
    this.context.fillText(barrageItem.value, barrageItem.left, barrageItem.top);
  }

  /**
   * @description 随机生成弹幕位置
   */
  private getTop(): number {
    return Math.floor(Math.random() * (this.height - 20) + 20);
  }

  /**
   * @description 随机生成弹幕速度
   */
  private getOffset(): number {
    return Number((Math.random() * 2).toFixed(1)) + 2;
  }

  /**
   * @description 随机生成弹幕颜色
   */
  private getMultiColor(): string {
    const BUILT_IN_COLORS = ['#ffffff', '#1e87f0', '#7ac84b', '#ff69b4', '#ff7f00', '#9b39f4', '#ff0000'];
    return BUILT_IN_COLORS[Number(Math.floor(Math.random() * 7).toFixed(0))];
  }
}
