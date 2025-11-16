import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import { TemperatureService, Temperature } from './temperature.service';
// import Chart from 'chart.js/auto';s

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Temperatura',
        fill: true,
        tension: 0.4,
        borderColor: 'blue',
        backgroundColor: 'rgba(30,144,255,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true, // permite que o gráfico se ajuste ao container
  };

  constructor(private tempService: TemperatureService) {}

  ngOnInit(): void {
    this.loadData();
    setInterval(() => this.loadData(), 1000);
  }

  loadData(): void {
    this.tempService.getTemperatures().subscribe((data: Temperature[]) => {
      const sorted = data.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      this.lineChartData.labels = sorted.map((t) =>
        new Date(t.timestamp).toLocaleTimeString()
      );
      this.lineChartData.datasets[0].data = sorted.map((t) => t.value);

      // muda a cor de fundo de cada ponto conforme o valor
      this.lineChartData.datasets[0].backgroundColor = sorted.map((t) =>
        t.value > 32 ? 'red' : 'blue'
      );
      this.chart?.update(); // força atualização do gráfico sem reload da página
    });
  }
}
