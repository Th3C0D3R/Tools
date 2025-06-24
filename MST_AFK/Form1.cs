using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MST_AFK
{
    public partial class Form1 : Form
    {

        const int WM_KEYDOWN = 0x0100;
        const int WM_KEYUP = 0x0101;
        const int VK_SHIFT = 0x10;

        [DllImport("user32.dll", SetLastError = true)]
        static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

        [DllImport("user32.dll")]
        static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);


        public Form1()
        {
            InitializeComponent();
            this.WindowState = FormWindowState.Minimized;
            this.ShowInTaskbar = false;
            this.Visible = false;
            this.Opacity = 0;
            this.Load += (_, l) => RunLoop();
        }
        private async void RunLoop()
        {
            var processes = Process.GetProcessesByName("ms-teams");
            IntPtr hWnd = processes.FirstOrDefault(p => p.MainWindowHandle != IntPtr.Zero)?.MainWindowHandle ?? IntPtr.Zero;
            if (hWnd == IntPtr.Zero) return;

            while (true)
            {
                PostMessage(hWnd, WM_KEYDOWN, (IntPtr)VK_SHIFT, IntPtr.Zero);
                await Task.Delay(TimeSpan.FromSeconds(2));
                PostMessage(hWnd, WM_KEYUP, (IntPtr)VK_SHIFT, IntPtr.Zero); 
                await Task.Delay(TimeSpan.FromSeconds(10));
            }
        }
    }
}
