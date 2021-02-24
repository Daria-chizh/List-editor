import puppetteer from 'puppeteer';
import runServer from './e2e.server';

jest.setTimeout(30000); // default puppeteer timeout

describe('Prodcut list', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = await runServer();
    browser = await puppetteer.launch({
      headless: false, // show gui
      slowMo: 250,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.close();
  });

  const getDisplayedRecords = async () => {
    const records = await page.evaluate(() => {
      const result = [];

      const rowElements = document.querySelectorAll('tr');
      for (let i = 0; i < rowElements.length; i += 1) {
        const rowElement = rowElements[i];
        const row = [];
        const cellElements = rowElement.querySelectorAll('td');
        for (let j = 0; j < cellElements.length; j += 1) {
          const cellElement = cellElements[j];
          row.push(cellElement.textContent.trim());
        }
        result.push(row);
      }

      return result;
    });

    return records;
  };

  test('remove record', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('tr[data-id="0"]');
    await page.click('tr[data-id="0"] .removeAction');
    await page.waitForSelector('#confirmDelete', { visible: true });
    await page.click('#agreeDelete');

    const records = await getDisplayedRecords();
    expect(records).toEqual([
      ['name', 'cost', 'actions'],
      ['Samsung galaxy s10+', '80000', '✎', '✖'],
      ['Huawei View', '50000', '✎', '✖'],
    ]);
  });

  test('cancel button', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('tr[data-id="0"]');
    await page.click('tr[data-id="0"] .removeAction');
    await page.waitForSelector('#confirmDelete', { visible: false });
    await page.click('#cancelDelete');

    const records = await getDisplayedRecords();
    expect(records).toEqual([
      ['name', 'cost', 'actions'],
      ['Iphone XR', '60000', '✎', '✖'],
      ['Samsung galaxy s10+', '80000', '✎', '✖'],
      ['Huawei View', '50000', '✎', '✖'],
    ]);
  });

  test('edit cancel button', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('tr[data-id="0"]');
    await page.click('tr[data-id="0"] .editIcons');
    await page.waitForSelector('#modal-window', { visible: false });
    await page.click('#cancel');

    const records = await getDisplayedRecords();
    expect(records).toEqual([
      ['name', 'cost', 'actions'],
      ['Iphone XR', '60000', '✎', '✖'],
      ['Samsung galaxy s10+', '80000', '✎', '✖'],
      ['Huawei View', '50000', '✎', '✖'],
    ]);
  });

  test('edit save button', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('tr[data-id="0"]');
    await page.click('tr[data-id="0"] .editIcons');
    await page.waitForSelector('#modal-window', { visible: true });
    await page.$eval('#textName', (el) => { el.value = 'Nokia'; }); // eslint-disable-line no-param-reassign
    await page.$eval('#numberName', (el) => { el.value = '45000'; }); // eslint-disable-line no-param-reassign
    await page.click('#save');

    const records = await getDisplayedRecords();
    expect(records).toEqual([
      ['name', 'cost', 'actions'],
      ['Nokia', '45000', '✎', '✖'],
      ['Samsung galaxy s10+', '80000', '✎', '✖'],
      ['Huawei View', '50000', '✎', '✖'],
    ]);
  });

  test('edit name error', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('tr[data-id="0"]');
    await page.click('tr[data-id="0"] .editIcons');
    await page.waitForSelector('#modal-window', { visible: true });
    await page.$eval('#textName', (el) => { el.value = ''; }); // eslint-disable-line no-param-reassign
    await page.$eval('#numberName', (el) => { el.value = '45000'; }); // eslint-disable-line no-param-reassign
    await page.click('#itemForm');

    const isNameValid = await page.$eval('#textName', (el) => el.validity.valid); // eslint-disable-line no-param-reassign
    expect(isNameValid).toBeFalsy();
  });

  test('edit number error', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('tr[data-id="0"]');
    await page.click('tr[data-id="0"] .editIcons');
    await page.waitForSelector('#modal-window', { visible: true });
    await page.$eval('#textName', (el) => { el.value = 'Nokia'; }); // eslint-disable-line no-param-reassign
    await page.$eval('#numberName', (el) => { el.value = '0'; }); // eslint-disable-line no-param-reassign
    await page.click('#itemForm');

    const isCostValid = await page.$eval('#numberName', (el) => el.validity.valid); // eslint-disable-line no-param-reassign
    expect(isCostValid).toBeFalsy();
  });

  test('add content', async () => {
    await page.goto(baseUrl);
    await page.click('#addCart');
    await page.waitForSelector('#modal-window', { visible: true });
    await page.$eval('#textName', (el) => { el.value = 'Nokia'; }); // eslint-disable-line no-param-reassign
    await page.$eval('#numberName', (el) => { el.value = '45000'; }); // eslint-disable-line no-param-reassign
    await page.click('#save');

    const records = await getDisplayedRecords();
    expect(records).toEqual([
      ['name', 'cost', 'actions'],
      ['Iphone XR', '60000', '✎', '✖'],
      ['Samsung galaxy s10+', '80000', '✎', '✖'],
      ['Huawei View', '50000', '✎', '✖'],
      ['Nokia', '45000', '✎', '✖'],
    ]);
  });
});
