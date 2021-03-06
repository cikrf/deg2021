/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { ErrorSection } from './error-section.enum';

export const ERROR_MAP: any = {
  404: {
    TITLE: 'Ошибка 404',
    TEXT: 'Сообщите нам о проблеме по бесплатному номеру горячей линии <span class="nowrap">8-800-200-36-20</span> или отправьте письмо на адрес электронной почты <a href="mailto:deg@vybory.gov.ru">deg@vybory.gov.ru</a>',
  },
  SERVER_ERROR: {
    TITLE: 'Ведутся работы',
    TEXT: 'Пожалуйста, зайдите на портал дистанционного электронного голосования позже. <br>Если ситуация не изменится, сообщите нам о проблеме<br/>по бесплатному номеру горячей линии <span class="nowrap">8-800-200-36-20</span>',
    0: {
      TITLE: 'Истекло время ожидания ответа сервиса',
      TEXT: 'Попробуйте чуть позже<br><br>Если ошибка повторяется, сообщите этот код в техническую поддержку по телефону <span class="nowrap">8-800-200-36-20</span>',
    },
  },
  ESIA: {
    ACCESS_DENIED: {
      TITLE: 'Необходимо предоставить права доступа',
      TEXT: 'Для сопоставления Ваших данных со списком избирателей ПТК ДЭГ требуется получить права на доступ к Вашим данным в ЕСИА. <br>Для предоставления прав пройдите процедуру авторизации повторно.',
    },
    51: {
      TITLE: 'У вас неподтвержденная учетная запись ЕСИА',
      TEXT: 'Вы не сможете воспользоваться порталом. Подтвердите учетную запись и возвращайтесь',
    },
  },
  CLOSED: {
    TITLE: 'Участок ДЭГ закрыт',
    TEXT: 'Вы не можете получить бюллетень или проголосовать.',
  },
  CHECKUP: {
    TITLE: 'Браузер не прошел тест!',
    TEXT: 'К сожалению ваш браузер не подойдет для голосования. <br/>Воспользуйтесь другим браузером.',
  },
  NO_ELECTIONS: {
    TITLE: 'Нет доступных голосований',
    TEXT: 'Возможно, голосование еще не началось или у вас нет активного избирательного права.',
  },
  NO_CONNECTION: {
    TITLE: 'Истекло время ожидания ответа сервиса',
    TEXT: 'Попробуйте чуть позже<br><br>Если ошибка повторяется, сообщите этот код в техническую поддержку по телефону <span class="nowrap">8-800-200-36-20</span>',
  },
};
