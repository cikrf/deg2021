import {
  ComponentRef,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { GasDynamicComponentsService } from '@cikrf/gas-utils/services';
import { UiPreloaderComponent } from '@ui/components/ui-preloader/ui-preloader.component';

/**
 * Данная структурная директива создана для того, что бы отображать preloader загрузки
 *
 * Для этого нужно передать флаг о том, какое сейчас состояние
 *
 * Если пришло состояние true
 * Тогда директива делает render вашего элемента, получает необходимую мета информацию
 * Такую как текущий класс(ибо без рендеринга он ее не может получить) и тп.
 * А так же получает хост аттрибут, для того, что бы стили работали
 *
 * Далее очищает контейнер и динамически создает preloader вместо вашего элемента
 * И прокидывает классы и хост аттрибут
 */
@Directive({
  selector: '[uiPreloader]',
})
export class UiPreloaderDirective {
  @Input('uiPreloader')
  public set uiPreloader(isShow: boolean) {
    /** Создаем элемент, для получения ссылки и работы с элементом */
    const embedded = this.viewContainer.createEmbeddedView(this.templateRef);

    const embeddedElement: HTMLElement = embedded.rootNodes[0];

    /** Очищаем контейнер, ибо он должен быть пустой */
    this.viewContainer.clear();

    /** Скрываем старый контент и показываем preloader */
    if (isShow) {
      /** Ожидаем появления inputs */
      setTimeout(() => {
        Array(this.uiPreloaderLines).fill(0).forEach((value, index) => {
          const componentRef: ComponentRef<UiPreloaderComponent> = this.gasDynamicComponentService.createComponent(
            UiPreloaderComponent,
            { viewContainer: this.viewContainer },
          );

          this.initProperties(componentRef, embeddedElement, index);
        });
      });
    } else {
      // todo: не убирает прелоадер если false приходит очень быстро
      this.viewContainer.clear();

      this.viewContainer.createEmbeddedView(this.templateRef);

      if (this.componentRefs) {
        this.componentRefs.forEach((ref: ComponentRef<UiPreloaderComponent>) => ref.destroy());
      }
    }
  }

  @Input()
  public uiPreloaderLines = 1;

  @Input()
  public uiPreloaderPrimary = false;

  @Input()
  public uiPreloaderHeight = 0;

  @Input()
  public uiPreloaderWidth = 0;

  public previousText = '';

  public componentRef: ComponentRef<UiPreloaderComponent>;

  private componentRefs: ComponentRef<UiPreloaderComponent>[] = [];

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<HTMLElement>,
    private gasDynamicComponentService: GasDynamicComponentsService,
  ) {}

  private initProperties(
    componentRef: ComponentRef<UiPreloaderComponent>,
    embeddedElement: HTMLElement,
    index: number,
  ): void {
    const classList = embeddedElement?.classList?.toString() || '';

    /** Получаем родительский хост аттрибут */
    const hostAttribute = (embeddedElement?.getAttributeNames() || [])
      .find((attribute: string) => attribute.indexOf('_ngcontent-') > -1) || '';

    if (classList) {
      componentRef.instance.addClass(classList);
    }

    if (hostAttribute) {
      componentRef.instance.addAttribute(hostAttribute);
    }

    if (this.uiPreloaderLines > 1) {
      componentRef.instance.initMultiLine((index + 1) === this.uiPreloaderLines);
    }

    if (this.uiPreloaderHeight) {
      componentRef.instance.setHeight(this.uiPreloaderHeight);
    }

    if (this.uiPreloaderPrimary) {
      componentRef.instance.makePrimary();
    }

    if (this.uiPreloaderWidth) {
      componentRef.instance.setWidth(this.uiPreloaderWidth);
    } else {
      componentRef.instance.initWidth();
    }
  }
}
