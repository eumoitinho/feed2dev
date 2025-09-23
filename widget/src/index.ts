import './styles/widget.css';
import { WidgetCore } from './core/widget';
import { WidgetConfig } from './types';

interface Feed2DevGlobal {
  init: (config: WidgetConfig) => void;
  open: () => void;
  close: () => void;
  destroy: () => void;
}

let widgetInstance: WidgetCore | null = null;

const Feed2Dev: Feed2DevGlobal = {
  init: (config: WidgetConfig) => {
    if (widgetInstance) {
      widgetInstance.destroy();
    }
    widgetInstance = new WidgetCore(config);
    widgetInstance.init();
  },
  
  open: () => {
    if (widgetInstance) {
      widgetInstance.open();
    }
  },
  
  close: () => {
    if (widgetInstance) {
      widgetInstance.close();
    }
  },
  
  destroy: () => {
    if (widgetInstance) {
      widgetInstance.destroy();
      widgetInstance = null;
    }
  }
};

export default Feed2Dev;