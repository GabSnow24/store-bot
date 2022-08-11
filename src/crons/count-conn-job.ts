import { PromService } from '@digikare/nestjs-prom'
import { INestApplication, Logger } from '@nestjs/common'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import os from 'os-utils'

async function promGaugeConnections(
  promService: PromService,
  description: { name: string; help: string },
  count: number
) {
  promService.getGauge(description).set(count)
}

export async function setCronJob(app: INestApplication) {
  const cronJobInstance = new SchedulerRegistry()
  const server = app.getHttpServer()
  const job = new CronJob(CronExpression.EVERY_10_SECONDS, () => {
    const connectionCount = server.getConnections((_err: any, count: number) => {
      promGaugeConnections(
        new PromService(),
        { name: 'node_connections', help: 'Metric for connections on server' },
        count
      )
      Logger.log(`There ${count} connections`)
      return count
    })
    os.cpuUsage(function (v) {
      promGaugeConnections(new PromService(), { name: 'node_cpu_usage', help: 'Metric for system cpu usage' }, v)
    })

    const loadAvgs = [
      { name: 'system_load_avg_1m', help: 'Metric for system load average in 1 minute', time: 1 },
      { name: 'system_load_avg_5m', help: 'Metric for system load average in 5 minutes', time: 5 },
      { name: 'system_load_avg_15m', help: 'Metric for system load average in 15 minutes', time: 15 }
    ]
    loadAvgs.forEach((loadAvg) => {
      const { time, ...loadAvgPayload } = loadAvg
      promGaugeConnections(new PromService(), loadAvgPayload, os.loadavg(time))
    })

    promGaugeConnections(
      new PromService(),
      { name: 'system_cpu_count', help: 'Metric for system cpu count' },
      os.cpuCount()
    )
    return connectionCount
  })
  cronJobInstance.addCronJob('connectionCount', job)
  job.start()
}
