import React, { Fragment, useState } from 'react';
import { Global, css } from '@emotion/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CkEditor = ({ value, onChangeData }) => {
  const [data, setData] = useState(value);
  const dataColor = [
    { label: 'magenta-1', color: '#fff0f6' },
    { label: 'magenta-2', color: '#ffd6e7' },
    { label: 'magenta-3', color: '#ffadd2' },
    { label: 'magenta-4', color: '#ff85c0' },
    { label: 'magenta-5', color: '#f759ab' },
    { label: 'magenta-6', color: '#eb2f96' },
    { label: 'magenta-7', color: '#c41d7f' },
    { label: 'magenta-8', color: '#9e1068' },
    { label: 'magenta-9', color: '#780650' },
    { label: 'magenta-10', color: '#520339' },
    { label: 'red-1', color: '#fff1f0' },
    { label: 'red-2', color: '#ffccc7' },
    { label: 'red-3', color: '#ffa39e' },
    { label: 'red-4', color: '#ff7875' },
    { label: 'red-5', color: '#ff4d4f' },
    { label: 'red-6', color: '#f5222d' },
    { label: 'red-7', color: '#cf1322' },
    { label: 'red-8', color: '#a8071a' },
    { label: 'red-9', color: '#820014' },
    { label: 'red-10', color: '#5c0011' },
    { label: 'volcano-1', color: '#fff2e8' },
    { label: 'volcano-2', color: '#ffd8bf' },
    { label: 'volcano-3', color: '#ffbb96' },
    { label: 'volcano-4', color: '#ff9c6e' },
    { label: 'volcano-5', color: '#ff7a45' },
    { label: 'volcano-6', color: '#fa541c' },
    { label: 'volcano-7', color: '#d4380d' },
    { label: 'volcano-8', color: '#ad2102' },
    { label: 'volcano-9', color: '#871400' },
    { label: 'volcano-10', color: '#610b00' },
    { label: 'orange-1', color: '#fff7e6' },
    { label: 'orange-2', color: '#ffe7ba' },
    { label: 'orange-3', color: '#ffd591' },
    { label: 'orange-4', color: '#ffc069' },
    { label: 'orange-5', color: '#ffa940' },
    { label: 'orange-6', color: '#fa8c16' },
    { label: 'orange-7', color: '#d46b08' },
    { label: 'orange-8', color: '#ad4e00' },
    { label: 'orange-9', color: '#873800' },
    { label: 'orange-10', color: '#612500' },
    { label: 'gold-1', color: '#fffbe6' },
    { label: 'gold-2', color: '#fff1b8' },
    { label: 'gold-3', color: '#ffe58f' },
    { label: 'gold-4', color: '#ffd666' },
    { label: 'gold-5', color: '#ffc53d' },
    { label: 'gold-6', color: '#faad14' },
    { label: 'gold-7', color: '#d48806' },
    { label: 'gold-8', color: '#ad6800' },
    { label: 'gold-9', color: '#874d00' },
    { label: 'gold-10', color: '#613400' },
    { label: 'yellow-1', color: '#feffe6' },
    { label: 'yellow-2', color: '#ffffb8' },
    { label: 'yellow-3', color: '#fffb8f' },
    { label: 'yellow-4', color: '#fff566' },
    { label: 'yellow-5', color: '#ffec3d' },
    { label: 'yellow-6', color: '#fadb14' },
    { label: 'yellow-7', color: '#d4b106' },
    { label: 'yellow-8', color: '#ad8b00' },
    { label: 'yellow-9', color: '#876800' },
    { label: 'yellow-10', color: '#614700' },
    { label: 'green-1', color: '#f6ffed' },
    { label: 'green-2', color: '#d9f7be' },
    { label: 'green-3', color: '#b7eb8f' },
    { label: 'green-4', color: '#95de64' },
    { label: 'green-5', color: '#73d13d' },
    { label: 'green-6', color: '#52c41a' },
    { label: 'green-7', color: '#389e0d' },
    { label: 'green-8', color: '#237804' },
    { label: 'green-9', color: '#135200' },
    { label: 'green-10', color: '#092b00' },
    { label: 'cyan-1', color: '#e6fffb' },
    { label: 'cyan-2', color: '#b5f5ec' },
    { label: 'cyan-3', color: '#87e8de' },
    { label: 'cyan-4', color: '#5cdbd3' },
    { label: 'cyan-5', color: '#36cfc9' },
    { label: 'cyan-6', color: '#13c2c2' },
    { label: 'cyan-7', color: '#08979c' },
    { label: 'cyan-8', color: '#006d75' },
    { label: 'cyan-9', color: '#00474f' },
    { label: 'cyan-10', color: '#002329' },
    { label: 'blue-1', color: '#e6f7ff' },
    { label: 'blue-2', color: '#bae7ff' },
    { label: 'blue-3', color: '#91d5ff' },
    { label: 'blue-4', color: '#69c0ff' },
    { label: 'blue-5', color: '#40a9ff' },
    { label: 'blue-6', color: '#1890ff' },
    { label: 'blue-7', color: '#096dd9' },
    { label: 'blue-8', color: '#0050b3' },
    { label: 'blue-9', color: '#003a8c' },
    { label: 'blue-10', color: '#002766' },
    { label: 'purple-1', color: '#f9f0ff' },
    { label: 'purple-2', color: '#efdbff' },
    { label: 'purple-3', color: '#d3adf7' },
    { label: 'purple-4', color: '#b37feb' },
    { label: 'purple-5', color: '#9254de' },
    { label: 'purple-6', color: '#722ed1' },
    { label: 'purple-7', color: '#531dab' },
    { label: 'purple-8', color: '#391085' },
    { label: 'purple-9', color: '#22075e' },
    { label: 'purple-10', color: '#120338' },
  ];
  const ckWrapperStyle = css`
    position: relative;
    z-index: 1;
    &::before {
      color: rgba(192, 192, 192, 1);
      content: attr(data-placeholder);
      padding: 0 11px;
      position: absolute;
      margin: var(--ck-spacing-large) 0;
      top: 0;
      z-index: -1;
    }
  `;
 
  return (
    <Fragment>
      <div
        className="ckeditor-wrapper"
        css={css`
          ${ckWrapperStyle}
        `}
      >
        <Global
          styles={css`
            :root {
              --ck-border-radius: 4px;
              --ck-color-focus-border: rgba(96, 103, 113, 0.8);
              --ck-color-shadow-inner: rgba(69, 79, 99, 0.2);
              --ck-inner-shadow: 0 0 0 2px var(--ck-color-shadow-inner);
              --ck-spacing-large: var(--ck-spacing-standard);
            }
            .ck.ck-editor__editable_inline {
              border: 1px solid rgba(217, 217, 217, 1);
              transition: all 0.3s;
              &:hover {
                border-color: rgba(96, 102, 112, 1);
                border-right-width: 1px !important;
              }
            }
            .ck-editor__editable.ck-read-only {
              background-color: rgba(245, 245, 245, 1);
              opacity: 1;
              cursor: not-allowed;
              color: rgba(0, 0, 0, 0.25);
              &:hover {
                border-color: rgba(217, 217, 217, 1);
              }
            }
          `}
        />
        <CKEditor
          editor={ClassicEditor}
          data={data}
          config={{
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              'blockQuote',
              'ckfinder',
              '|',
              'imageTextAlternative',
              'imageUpload',
              'imageStyle:full',
              'imageStyle:side',
              '|',
              'mediaEmbed',
              'insertTable',
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              '|',
              'undo',
              'redo',
            ],
            fontSize: {
              options: [9, 11, 13, 'default', 15, 17, 19, 21, 25, 27, 30],
            },
            language: 'vi',
            image: {
              styles: ['alignLeft', 'alignCenter', 'alignRight'],
              resizeOptions: [
                {
                  name: 'resizeImage:original',
                  label: 'Original',
                  value: null,
                },
                {
                  name: 'resizeImage:50',
                  label: '50%',
                  value: '50',
                },
                {
                  name: 'resizeImage:75',
                  label: '75%',
                  value: '75',
                },
              ],
              toolbar: [
                'imageStyle:alignLeft',
                'imageStyle:alignCenter',
                'imageStyle:alignRight',
                '|',
                'resizeImage',
                '|',
                'imageTextAlternative',
              ],
            },
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties',
              ],
              tableProperties: {
                borderColors: dataColor.filter(
                  (item) =>
                    item.label.indexOf('6') !== -1 ||
                    item.label.indexOf('7') !== -1 ||
                    item.label.indexOf('8') !== -1 ||
                    item.label.indexOf('9') !== -1 ||
                    item.label.indexOf('10') !== -1
                ),
                backgroundColors: dataColor.filter(
                  (item) =>
                    item.label.indexOf('6') !== -1 ||
                    item.label.indexOf('7') !== -1 ||
                    item.label.indexOf('8') !== -1 ||
                    item.label.indexOf('9') !== -1 ||
                    item.label.indexOf('10') !== -1
                ),
              },
              tableCellProperties: {
                borderColors: dataColor.filter(
                  (item) =>
                    item.label.indexOf('6') !== -1 ||
                    item.label.indexOf('7') !== -1 ||
                    item.label.indexOf('8') !== -1 ||
                    item.label.indexOf('9') !== -1 ||
                    item.label.indexOf('10') !== -1
                ),
                backgroundColors: dataColor.filter(
                  (item) =>
                    item.label.indexOf('6') !== -1 ||
                    item.label.indexOf('7') !== -1 ||
                    item.label.indexOf('8') !== -1 ||
                    item.label.indexOf('9') !== -1 ||
                    item.label.indexOf('10') !== -1
                ),
              },
            },
            alignment: {
              options: ['left', 'right', 'center'],
            },
            fontColor: {
              colors: dataColor,
              columns: 10,
            },
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setData(data);
            if (onChangeData) onChangeData(data);
          }}
        />
      </div>
    </Fragment>
  );
};

export default CkEditor;
